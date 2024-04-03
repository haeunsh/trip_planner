package kr.or.iei.blog.model.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.blog.model.dao.BlogDao;
import kr.or.iei.blog.model.dto.Blog;
import kr.or.iei.blog.model.dto.BlogDate;
import kr.or.iei.util.PageInfo;
import kr.or.iei.util.Pagination;

@Service
public class BlogService {
	@Autowired
	private BlogDao blogDao;
	@Autowired
	private Pagination pagination;	
	
	public Map selectBlogList(int reqPage) {
		int numPerPage = 10;
		int pageNaviSize = 5;
		int totalCount = blogDao.totalCount();
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);	
		List list = blogDao.selectBlogList(pi);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("blogList",list);
		map.put("pi",pi);
		return map;
	}	
	
	@Transactional
	public boolean insertBlog(Blog blog, List<List<LinkedHashMap<String, String>>> blogDateList) {
		int result = blogDao.insertBlog(blog);
		boolean returnResult = true;
		if(result == 0) {
			return false;
		}else {			
			for(int i = 0; i < blogDateList.size(); i++) {
				List<LinkedHashMap<String, String>> lbd = blogDateList.get(i);
				for(int j = 0; j < lbd.size(); j++) {
					BlogDate bd = new BlogDate();
					String title = lbd.get(j).get("blogDateScheduleTitle");
					bd.setBlogDateScheduleTitle(title);
					bd.setBlogDateScheduleContent(lbd.get(j).get("blogDateScheduleContent"));
					bd.setBlogNo(blog.getBlogNo());
					bd.setBlogDateDay(i);
					result = blogDao.insertBlogDate(bd);
					if(result == 0) {
						return false;
					}
				}
			}
		}		
		
		return true;
	}
	
}
