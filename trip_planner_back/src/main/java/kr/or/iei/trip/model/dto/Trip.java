package kr.or.iei.trip.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="trip")
@Schema(description = "여행일지 객체")
public class Trip {
	private int tripNo;
	private int memberNo;
	private String tripTitle;
	private String tripStartDate;
	private String tripEndDate;
	private String tripDetailListStr;
	private List<TripDetail> tripDetailList;
//	private String tripPlaceName;
//	private int tripPlaceCount;
}
