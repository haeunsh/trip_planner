package kr.or.iei.blog.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.blog.model.dto.Blog;

@Mapper
public interface BlogDao {

	int insertBlog(Blog blog);

	int insertBlogDate(Blog blog);

}
