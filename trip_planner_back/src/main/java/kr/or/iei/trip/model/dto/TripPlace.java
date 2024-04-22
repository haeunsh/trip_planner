package kr.or.iei.trip.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="tripPlace")
@Schema(description = "여행일지 장소 객체")
public class TripPlace {	
	private int placeNo;
	private String placeName;
	private String placeCategory;
	private String placeAddress;
	private String placePhone;
	private String placeLat;
	private String placeLng;
	
//	private int tripDetailNo;
//	private int tripNo;
//	private int tripRoute;
//	private int oldTripRoute;
//	private String tripDay;
//	private String oldTripDay;
//	private int delNo;
//	private String tripPlaceName;
//	private String tripPlaceCategory;
//	private String tripPlaceAddress;
//	private String tripPlacePhone;
//	private String tripPlaceLat;
//	private String tripPlaceLng;
//	private String tripTodo;
}
