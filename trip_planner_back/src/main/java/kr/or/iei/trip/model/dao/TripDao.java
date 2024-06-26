package kr.or.iei.trip.model.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.inn.model.dto.Inn;
import kr.or.iei.trip.model.dto.SearchPlace;
import kr.or.iei.trip.model.dto.Trip;
import kr.or.iei.trip.model.dto.TripDetail;
import kr.or.iei.trip.model.dto.TripPlace;
import kr.or.iei.util.PageInfo;

@Mapper
public interface TripDao {

	int insertTripList(TripPlace tp);

	int selectTotalPlaceCount(String keyword);

	ArrayList<TripPlace> selectSearchPlace(SearchPlace searchPlace);

	int selectTotalInnsCount(String keyword);

	ArrayList<Inn> selectSearchInns(SearchPlace searchInns);

	int insertTrip(Trip trip);

	int insertTripDetail(TripDetail td);

	List<Trip> selectMyComingTripList(String memberEmail, int start, int end);
	
	List<Trip> selectMyPastTripList(String memberEmail, int start, int end);

	Trip selectOneTrip(int tripNo);

	int updateTrip(Trip trip);

	int updateTripDetail(TripDetail td);
	
	int deleteTripDetail(TripDetail td);
	
	int deleteTrip(int tripNo);

//	int deleteTripPlace(TripPlace tp);
//
//	List<TripDetail> checkTdList(int tripNo);
//
//	String selectTripDetailNo(TripDetail td);
//
//	int updateTripPlace1(TripPlace tp);
//	
//	int updateTripPlace2(TripPlace tp);
//
//	int deleteTripDay(Trip trip);
//
//	int updateTripRoute(TripPlace tp);	
}
