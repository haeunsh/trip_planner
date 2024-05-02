package kr.or.iei.trip.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.inn.model.dto.Inn;
import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.trip.model.dao.TripDao;
import kr.or.iei.trip.model.dto.SearchPlace;
import kr.or.iei.trip.model.dto.Trip;
import kr.or.iei.trip.model.dto.TripDetail;
import kr.or.iei.trip.model.dto.TripPlace;
import kr.or.iei.util.PageInfo;
import kr.or.iei.util.Pagination;

@Service
public class TripService {
	@Autowired
	private TripDao tripDao;
	@Autowired
	private MemberDao memberDao;
	@Autowired
	private Pagination pagination;
	
	@Transactional
	public int insertTripList(ArrayList<TripPlace> placeList) {
		int result = 0;
		for(TripPlace tp: placeList) {
			result += tripDao.insertTripList(tp);
		}
		return result;
	}

	public Map selectSearchPlace(SearchPlace searchPlace) {
		String keyword = searchPlace.getKeyword();
		int reqPage = searchPlace.getReqPage();
		int numPerPage = 10;
		int pageNaviSize = 5;
		int totalCount = tripDao.selectTotalPlaceCount(keyword);
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		searchPlace.setStart(pi.getStart());
		searchPlace.setEnd(pi.getEnd());
		ArrayList<TripPlace> placeList = tripDao.selectSearchPlace(searchPlace);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("placeList", placeList);
		map.put("pi", pi);
//		System.out.println(map);
		return map;
	}

	public Map selectSearchInns(SearchPlace searchInns) {
		String keyword = searchInns.getKeyword();
		int reqPage = searchInns.getReqPage();
		int numPerPage = 10;
		int pageNaviSize = 5;
		int totalCount = tripDao.selectTotalInnsCount(keyword);
		System.out.println(totalCount);
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		searchInns.setStart(pi.getStart());
		searchInns.setEnd(pi.getEnd());
		ArrayList<Inn> innList = tripDao.selectSearchInns(searchInns);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("innList", innList);
		map.put("pi", pi);
		System.out.println(map);
		return map;
	}

	@Transactional
	public int insertTrip(Trip trip, String memberEmail) {
		Member m = memberDao.selectOneMember(memberEmail);
		trip.setMemberNo(m.getMemberNo()); 
		int result = tripDao.insertTrip(trip);
		for(TripDetail td : trip.getTripDetailList()) {
			td.setTripNo(trip.getTripNo());
			result += tripDao.insertTripDetail(td);
		}
		if(result == trip.getTripDetailList().size() + 1) {
			return 1;			
		}else {
			return 0;
		}
	}

	public List<Trip> selectMyComingTripList(int reqPage, String memberEmail) {
		int amount = 5;
		int end = reqPage * amount;
		int start = end - amount + 1;
		List<Trip> tripList = tripDao.selectMyComingTripList(memberEmail, start, end);
		return tripList;
	}
	
	public List<Trip> selectMyPastTripList(int reqPage, String memberEmail) {
		int amount = 5;
		int end = reqPage * amount;
		int start = end - amount + 1;
		List<Trip> tripList = tripDao.selectMyPastTripList(memberEmail, start, end);
		return tripList;
	}

	public Trip selectOneTrip(int tripNo) {
		return tripDao.selectOneTrip(tripNo);
	}

	@Transactional
	public int updateTrip(Trip trip) {
		return tripDao.updateTrip(trip);
	}

	@Transactional
	public int updateTripDetail(Trip trip) {
		int insertTdLength = 0;
		int insertTdResult = 0;
		int updateTdLength = 0;
		int updateTdResult = 0;
		int deleteTdLength = 0;
		int deleteTdResult = 0;
		
		for(TripDetail td : trip.getTripDetailList()) {
			if(td.getTripDetailNo() == 0) {
				System.out.println("새로 등록한 일정인 경우");
				insertTdLength++;
				insertTdResult += tripDao.insertTripDetail(td);
			}else {
				System.out.println("기존 일정인 경우");
				if(td.getDelNo() == 1) {
					System.out.println("삭제할 것: "+td);
					deleteTdLength++;
					deleteTdResult += tripDao.deleteTripDetail(td);
					System.out.println("deleteTdResult: "+deleteTdResult);
					System.out.println("deleteTdLength: "+deleteTdLength);
				}else {
					updateTdLength++;					
					updateTdResult += tripDao.updateTripDetail(td);
				}
			}
		}
		
		if(insertTdLength == insertTdResult && updateTdLength == updateTdResult && deleteTdLength == deleteTdResult) {
			return 1;
		}else {
			return -1;
		}
	}
	
//	@Transactional
//	public int updateTripDetail(Trip trip) {
//		int insertTdLength = 0;
//		int insertTdResult = 0;
//		int insertTpLength = 0;
//		int insertTpResult = 0;
//		
//		int updateTdLength = 0; 
//		int updateTdResult = 0;
//		
//		int deleteTpLength = 0;
//		int deleteTpResult = 0;
//		
//		int updateTpLength = 0;
//		int updateTpResult = 0;
//		
//		int returnResult = 0;
//		
//		ArrayList<TripPlace> routeChangeTpList = new ArrayList<TripPlace>();
////		int delTp = 0;
////		int rcTp = 0;
//		int changeRoutelength = 0;
//		int copyTripRoute = -1;
//		int copyOldTripRoute = -1;
//		int changeRouteResult = 0;
//		int lastResult = 0;
//		
//		for(TripDetail td : trip.getTripDetailList()) {
//			//일정이 새로 추가됐을 경우(날짜를 늘리고 새 일정 추가)
//			if(td.getTripDetailNo() == 0) {
//				System.out.println("일정이 새로 추가됐을 경우");
//				insertTdLength++;
//				td.setTripNo(trip.getTripNo());
//				//들어온 일정의 tripDay에 해당하는 tripDetailNo가 있는지 조회
//				String detailNo = tripDao.selectTripDetailNo(td);
//				//들어온 일정의 tripDay에 해당하는 tripDetailNo가  있으면
//				if(detailNo != null){
//					if(td.getSelectPlaceList() != null) {
//						//장소만 tripDetailNo 넣어서 insert
//						for(TripPlace tp : td.getSelectPlaceList()) {
//							System.out.println("장소만 tripDetailNo 넣어서 insert");
//							insertTpLength++;
//							tp.setTripDetailNo(Integer.parseInt(detailNo));
//							insertTpResult += tripDao.insertTripPlace(tp);
//						}
//					}
//					insertTdResult = 1;
//				}else {//들어온 일정의 tripDay에 해당하는 tripDetailNo가 없으면 tripDetail에 일정 추가
//					System.out.println("들어온 일정의 tripDay에 해당하는 tripDetailNo가 없으면 tripDetail에 일정 추가");
//					insertTdResult = tripDao.insertTripDetail(td);
//					if(td.getSelectPlaceList() != null) {
//						//장소마다 tripDetailNo 넣어서 insert
//						for(TripPlace tp : td.getSelectPlaceList()) {
//							System.out.println("장소마다 tripDetailNo 넣어서 insert");
//							insertTpLength++;
//							tp.setTripDetailNo(td.getTripDetailNo());
//							insertTpResult += tripDao.insertTripPlace(tp);
//						}
//					}
//				}
//			}
//			else {//기존 일정인 경우(등록되어있는 날짜에 장소를 추가/수정/삭제)
//				System.out.println("기존 일정인 경우");
//				updateTdLength++;
//				updateTdResult = tripDao.updateTripDetail(td);
//				if(td.getSelectPlaceList() != null) {
//					//기존 날짜에 장소가 있는 경우 
//					System.out.println("기존 날짜에 장소가 있는 경우");
//					for(TripPlace tp : td.getSelectPlaceList()) {
//						System.out.println("----------------------------------------------------------------------------------");
//						System.out.println(tp);
//						System.out.println("----------------------------------------------------------------------------------");
//						//기존 날짜에 장소가 새로 추가된 경우
//						if(tp.getTripDetailNo() == 0) {
//							System.out.println("기존 날짜에 장소가 새로 추가된 경우");
//							System.out.println(tp);
//							insertTpLength++;
//							//장소가 가진 detailNo가 0이기 때문에 td의 detailNo 부여
//							tp.setTripDetailNo(td.getTripDetailNo());
//							//장소 insert
//							insertTpResult += tripDao.insertTripPlace(tp);
//						}else {//기존 날짜에 기존 장소가 변경된 경우
//							System.out.println("기존 날짜에 기존 장소가 변경된 경우");
//							//기존 장소가 삭제예정인 경우
//							if(tp.getDelNo() == 1) {
//								System.out.println("기존 장소가 삭제예정인 경우");
//								System.out.println("service1 : "+tp.getDelNo()+"/"+tp.getOldTripRoute());
//								deleteTpLength++;
//								System.out.println("delNo가 1이다");
//								//tripDetailNo와 oldTripRoute번호로 지우기
//								tp.setTripRoute(tp.getOldTripRoute());
//								System.out.println("oldTripRoute와 : "+tp.getOldTripRoute());
//								System.out.println("detailNo로 : "+tp.getTripDetailNo());
//								deleteTpResult += tripDao.deleteTripPlace(tp);
//							}else if(tp.getDelNo() != 1 && tp.getOldTripRoute() != 0 && (tp.getOldTripRoute() != tp.getTripRoute()) && tp.getOldTripDay() == null) {
//								System.out.println("순서 변경했을 때");
//								System.out.println(tp.getTripPlaceName()+"oldTripRoute: "+tp.getOldTripRoute());
//								System.out.println("tripRoute: "+tp.getTripRoute());
//								changeRoutelength++;
//								if(tp.getOldTripRoute() == copyTripRoute) {
//									changeRouteResult += tripDao.updateTripRoute(tp);
//								}else if(tp.getOldTripRoute() != copyTripRoute && tp.getTripRoute() == copyOldTripRoute){
//									changeRouteResult += tripDao.updateTripRoute(tp);
//								}else {
//									copyTripRoute = tp.getTripRoute();
//									copyOldTripRoute = tp.getOldTripRoute();
//									tp.setTripRoute(-1);
//									changeRouteResult += tripDao.updateTripRoute(tp);
//									routeChangeTpList.add(tp);
//								}
//							}else {
//								System.out.println("어떤 것에도 해당되지 않는다면 그냥 평범한 todo 수정이 아닐까?");
//								updateTpLength++;
//								updateTpResult += tripDao.updateTripPlace1(tp);
//							}
//							
//							//기존 일정을 줄여서 장소의 정보가 변경된 경우
//							if(tp.getOldTripDay() != null && (!tp.getOldTripDay().equals(tp.getTripDay()))) {
//								System.out.println("기존 일정을 줄여서 장소의 정보가 변경된 경우");
//								System.out.println("oldTripDay"+tp.getOldTripDay());
//								System.out.println("tripday"+tp.getTripDay());
//								System.out.println("tpTripDetailNo"+tp.getTripDetailNo());
//								System.out.println("tdTripDetailNO"+td.getTripDetailNo());
//								System.out.println("tpTripROute"+tp.getTripRoute());
//								System.out.println("tpOldTripROute"+tp.getOldTripRoute());
//								
//								updateTpLength++;
//
//								int tpDeNo = tp.getTripDetailNo();
//								
//								tp.setTripDetailNo(td.getTripDetailNo());
//								tp.setTripNo(td.getTripNo());
//								
//								updateTpResult += tripDao.updateTripPlace2(tp);
//							
//								System.out.println("tpno"+tpDeNo);
//							}
//						}
//					}
//					//for문 나와서 tripRoute 업데이트 마무리
//					for(TripPlace tp : routeChangeTpList) {
//						tp.setTripRoute(copyTripRoute);
//						tp.setOldTripRoute(-1);
//						changeRouteResult  += tripDao.updateTripRoute(tp);
//					}
//				routeChangeTpList.clear();
//				}
//			}
//			//모든게 끝나고 난 후 tripDetail 빈거 정리
//		}
//		System.out.println("모든게 끝나고 난 후 tripDetail 빈거 정리");
//		System.out.println("*************************************************************************");
//		System.out.println(trip);
//		System.out.println("*************************************************************************");
//		lastResult = tripDao.deleteTripDay(trip);
//		
//		//일정 추가시 결과 리턴
//		if(insertTdLength == insertTdResult && insertTpLength == insertTpResult) {
//			returnResult = 1;
//		}else {
//			returnResult = -1;
//		}
//		//장소 변경시 결과 리턴(장소 삭제||장소 루트 변경||장소 업데이트(todo 수정, 장소의 일정 변경))
//		if(deleteTpLength == deleteTpResult || changeRoutelength+1 == changeRouteResult || updateTpLength == updateTpResult) {
//			returnResult = 1;
//		}else {
//			returnResult = -1;
//		}
//		return returnResult;
//	}
//
//	@Transactional
//	public int deleteTrip(int tripNo) {
//		return tripDao.deleteTrip(tripNo);
//	}
}
