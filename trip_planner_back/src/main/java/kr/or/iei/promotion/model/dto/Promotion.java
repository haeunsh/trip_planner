package kr.or.iei.promotion.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Alias(value="promotion")
public class Promotion {
	private int promotionNo;
	private int partnerNo;
	private String promotionName;
	private int promotionPrice;
	private String promotionIntro;
	private String promotionRegion;
	private int promotionLimit;
	private String promotionImg;
	private String promotionExpiredDate;
	
	private String promotionType;
	private int orderNo;
	private String partnerName;
	private String partnerTel;
	private int remaingSeat;
}
