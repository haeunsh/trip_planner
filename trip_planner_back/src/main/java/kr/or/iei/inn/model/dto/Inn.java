package kr.or.iei.inn.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("inn")
public class Inn {
	private int innNo;
	private int partnerNo;
	private int innType;
	private String innAddr;
	private String innInfo;
	private String innCheckInTime;
	private String innCheckOutTime;
	private String innIntro;
	private List fileList;
	private String partnerName;
	private double reviewRate;
	private String filepath;
	private String innTypeStr;
	private String partnerTel;
}
