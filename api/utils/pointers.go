package utils

import (
	"strconv"
	"time"
)

func StrPtr(str string) *string {
	return &str
}

func Uint16Ptr(num uint64) *uint16 {
	num16 := uint16(num)
	return &num16
}

func ParseTimePtr(dateStr string) *time.Time {
	var datePtr *time.Time

	if dateStr != "" {
		date, err := time.Parse(time.RFC3339Nano, dateStr)
		if err == nil {
			datePtr = &date
		}
	}

	return datePtr
}

func ParseUint16Ptr(numStr string) *uint16 {
	var numPtr *uint16

	if numStr != "" {
		num, err := strconv.ParseUint(numStr, 10, 32)
		if err != nil {
			// eat the error and just return a nil
			return nil
		}

		u16num := uint16(num)
		numPtr = &u16num
	}

	return numPtr
}
