package kr.or.iei.member.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.ResponseDTO;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.member.model.service.MemberService;
import lombok.Getter;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/member")
public class MemberController {
	
	@Autowired
	private MemberService memberService;

	
	@PostMapping(value="/login")
	public ResponseEntity<ResponseDTO> login(@RequestBody Member member){
		String accessToken = memberService.login(member);
		if(accessToken != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", accessToken);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@PostMapping(value="/kakaoLogin")
	public ResponseEntity<ResponseDTO> kakaoLogin(@RequestBody Member member){
		Member m = memberService.kakaoLogin(member);
		if(m != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", m);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@GetMapping
	public ResponseEntity<ResponseDTO> getMember(@RequestAttribute String memberEmail){
		Member member = memberService.selectOneMember(memberEmail);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", member);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@PostMapping(value="/join")
	public ResponseEntity<ResponseDTO> join(@RequestBody Member member){
		int result = memberService.insertMember(member);
		if(result>0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
}
