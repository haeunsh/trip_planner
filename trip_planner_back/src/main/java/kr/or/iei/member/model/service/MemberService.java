package kr.or.iei.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.dto.Member;

@Service
public class MemberService {
	@Autowired
	private MemberDao memberDao;

	public Member login(Member member) {
		return memberDao.login(member);
	}
}
