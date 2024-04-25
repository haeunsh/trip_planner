package kr.or.iei.trip.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.or.iei.util.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="searchPlace")
@Schema(description = "여행일지 검색 장소 객체")
public class SearchPlace {
	private String keyword;
	private int reqPage;
	private int start;
	private int end;
}
