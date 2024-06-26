package kr.or.iei.tour.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import kr.or.iei.ResponseDTO;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.review.model.dto.Review;
import kr.or.iei.inn.model.dto.InnReservation;
import kr.or.iei.like.model.dto.Like;
import kr.or.iei.tour.model.dto.Tour;
import kr.or.iei.tour.model.dto.TourBook;
import kr.or.iei.tour.model.dto.TourTicket;
import kr.or.iei.tour.model.service.TourService;
import kr.or.iei.util.FileUtils;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/tour")
public class TourController {
	@Autowired
	private TourService tourService;
	@Autowired
	private FileUtils fileUtils;
	@Value("${file.root}")
	private String root;
	
	@GetMapping(value="/sale/{reqPage}/{memberNo}")
	public ResponseEntity<ResponseDTO> tourSale(@PathVariable int reqPage, @PathVariable int memberNo){
		Map map = tourService.selectTourSale(reqPage, memberNo);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@PostMapping(value="/reg")
	public ResponseEntity<ResponseDTO> insertTour(@ModelAttribute Tour tour, @ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile intronail, @RequestAttribute String memberEmail) {
		String savepath = root+"/tour/";

		if(thumbnail != null) {
			String filepath = fileUtils.upload(savepath, thumbnail);
			tour.setTourImg(filepath);
		}
		if(intronail != null) {
			String intropath = fileUtils.upload(savepath, intronail);
			tour.setTourIntro(intropath);
		}
		
		int result = tourService.insertTour(tour,memberEmail);
		if(result == 1) {
			// 등록한 투어상품 번호를 찾기
			int tourNo = tourService.getLastInsertTourNo();
			// 투어 등록하는 동시에 임시 이용권 금액 입력(0원)
			tourService.tempTourTicket(tourNo);
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", tourNo);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	@PatchMapping(value="/status/{tourNo}/{salesStatus}")
	public ResponseEntity<ResponseDTO> updateStatus(@PathVariable int tourNo, @PathVariable int salesStatus) {
		int result = tourService.updateStatus(tourNo, salesStatus);
		if(result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	@DeleteMapping(value="{tourNo}")
	public ResponseEntity<ResponseDTO> deleteTour(@PathVariable int tourNo){
		int result = tourService.deleteTour(tourNo);
		if(result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	@GetMapping(value="/one/{tourNo}")
	public ResponseEntity<ResponseDTO> selectOneTour(@PathVariable int tourNo, @RequestAttribute String memberEmail){
		// 메일 -> 회원번호 -> 업체번호 -> 투어번호 체크
		int partnerNo = tourService.searchPartnerNo(memberEmail);
		int checkNo = tourService.checkPartnerNo(tourNo);
//		System.out.println("내 업체번호 : " +partnerNo+", 들어온 업체번호 : "+checkNo);
		if(partnerNo == checkNo) {
			Tour tour = tourService.selectOneTour(tourNo);
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", tour);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());			
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	@PatchMapping(value="/edit")
	public ResponseEntity<ResponseDTO> modifyTour(@ModelAttribute Tour tour, @ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile intronail){
		String savepath = root+"/tour/";
		if(tour.getThumbnailCheck() == 1) {		// 섬네일이 변경된 경우에만
			if(thumbnail != null) {				// 새로 첨부한 경우
				String filepath = fileUtils.upload(savepath, thumbnail);
				tour.setTourImg(filepath);
			} else {							// 기존파일을 지우기만 한 경우
				tour.setTourImg(null);
			}
		}
		if(tour.getIntronailCheck() == 1) {
			if(intronail != null) {
				String filepath = fileUtils.upload(savepath, intronail);
				tour.setTourIntro(filepath);
			} else {
				tour.setTourIntro(null);
			}
		}
		int result = tourService.updateTour(tour);
		if(result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	@GetMapping(value="/ticket/{tourNo}")
	public ResponseEntity<ResponseDTO> selectTourTicket(@PathVariable int tourNo){
		TourTicket tourTicket = tourService.selectTourTicket(tourNo);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", tourTicket);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@PatchMapping(value="/ticket")
	public ResponseEntity<ResponseDTO> modifyTourTicket(@ModelAttribute TourTicket tourTicket){
		int result = tourService.modifyTourTicket(tourTicket);
		if(result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	@GetMapping
	public ResponseEntity<ResponseDTO> tourList(){
		Map map = tourService.selectTourList();
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@PostMapping(value="/tourSearch")
	public ResponseEntity<ResponseDTO> searchTour(@RequestBody Map requestData){
		String searchText = (String) requestData.get("searchText");
	    String startDate = (String) requestData.get("startDate");
		
		Map map = tourService.searchTour(searchText, startDate);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@PostMapping(value="/tourType")
	public ResponseEntity<ResponseDTO> searchType(@RequestBody Map<String, Integer> requestData){
		int tourType = requestData.get("tourType");
		Map map = tourService.searchType(tourType);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@GetMapping(value="/view/{tourNo}")
	public ResponseEntity<ResponseDTO> viewTourDetail(@PathVariable int tourNo){
		Map map = tourService.viewTourDetail(tourNo);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@PostMapping(value="/review")
	public ResponseEntity<ResponseDTO> insertReview(@ModelAttribute Review review, @RequestAttribute String memberEmail) {
		int result = tourService.insertReview(review,memberEmail);
		if(result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	@GetMapping(value="/reviewList/{tourNo}")
	public ResponseEntity<ResponseDTO> viewReviewList(@PathVariable int tourNo){
		Map map = tourService.selectReviewList(tourNo);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@GetMapping(value="/member")
	public ResponseEntity<ResponseDTO> selectLoginMember(@RequestAttribute String memberEmail){
		System.out.println("멤버 메소드");
		Member member = tourService.selectLoginMember(memberEmail);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", member);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@PatchMapping(value="/review/{reviewNo}")
	public ResponseEntity<ResponseDTO> modifyTourReview(@PathVariable int reviewNo, @RequestBody Review review){
		int result = tourService.modifyTourReview(reviewNo, review);
		if(result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	@DeleteMapping(value="/review/{reviewNo}")
	public ResponseEntity<ResponseDTO> deleteTourReview(@PathVariable int reviewNo){
		int result = tourService.deleteReview(reviewNo);
		if(result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	@PostMapping(value="/book")
	public ResponseEntity<ResponseDTO> insertBook(@RequestBody TourBook tourBook){
		int result = tourService.insertBook(tourBook);
		if(result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	@GetMapping(value="/mgmt/{reqPage}/{memberNo}")
	public ResponseEntity<ResponseDTO> tourBook(@PathVariable int reqPage, @PathVariable int memberNo){
		Map map = tourService.selectTourBook(reqPage, memberNo);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@GetMapping(value="/mgmtSearch1/{reqPage}/{searchText}/{memberNo}")
	public ResponseEntity<ResponseDTO> searchTourMgmt1(@PathVariable int reqPage, @PathVariable String searchText, @PathVariable int memberNo){
	    Map map = tourService.searchTourMgmt1(reqPage, searchText, memberNo);
	    ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
	    return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@GetMapping(value="/mgmtSearch2/{reqPage}/{searchText}/{memberNo}")
	public ResponseEntity<ResponseDTO> searchTourMgmt2(@PathVariable int reqPage, @PathVariable String searchText, @PathVariable int memberNo){
	    Map map = tourService.searchTourMgmt2(reqPage, searchText, memberNo);
	    ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
	    return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@GetMapping(value="/topTour")
	public ResponseEntity<ResponseDTO> topTourList(){
		Map map = tourService.selectTopTour();
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@PostMapping(value="/like")
	public ResponseEntity<ResponseDTO> insertTourLike(@ModelAttribute Like like) {
		int result = tourService.insertLike(like);
		if(result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	

	
}
