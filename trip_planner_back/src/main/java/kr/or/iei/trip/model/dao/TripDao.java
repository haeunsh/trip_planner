package kr.or.iei.trip.model.dao;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.trip.model.dto.Trip;
import kr.or.iei.trip.model.dto.TripDetail;
import kr.or.iei.trip.model.dto.TripPlace;

@Mapper
public interface TripDao {

	int insertTripList(TripPlace tp);

//	int insertTrip(Trip trip);
//
//	int insertTripDetail(TripDetail td);
//
//	int insertTripPlace(TripPlace tp);
//
//	List<Trip> selectMyComingTripList(String memberEmail, int start, int end);
//	
//	List<Trip> selectMyPastTripList(String memberEmail, int start, int end);
//
//	Trip selectOneTrip(int tripNo);
//
//	int updateTrip(Trip trip);
//
//	int updateTripDetail(TripDetail td);
//
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
//	int deleteTripDetail(TripPlace tp);
//
//	int deleteTripDay(Trip trip);
//
//	int updateTripRoute(TripPlace tp);
//
//	int deleteTrip(int tripNo);
	
}
