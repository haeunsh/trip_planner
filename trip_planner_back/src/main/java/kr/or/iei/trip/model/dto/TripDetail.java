package kr.or.iei.trip.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.or.iei.inn.model.dto.Inn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="tripDetail")
@Schema(description = "여행일지 상세 객체")
public class TripDetail {
	private int tripDetailNo;
	private int tripNo;
	private int innNo;
	private int placeNo;
	private int delNo;
	private String tripDay;
	private String oldTripDay;
	private int tripRoute;
	private int oldTripRoute;
	private int tripCost;
	private String tripTodo;
	private TripPlace selectPlace;
	private Inn selectInn;
}
