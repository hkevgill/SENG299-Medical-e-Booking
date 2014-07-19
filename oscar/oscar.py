#!/usr/bin/python

import requests
import json
import time

targeturl = 'http://127.0.0.1:8888'
targethandler = '/slot'

def main():
	year = 2014
	month = 08
	date = 01
	hour = 12
	minute = 00

	physicians = ['DrJones', 'DrMeyer', 'DrThompson', 'DrPeters']

	while(month < 8):

		time.sleep(900)

		for physician in physicians:
			print physician
			year = 2014
			month = 07
			date = 15
			hour = 12
			minute = 00


			data = {}
			headers = {}

			minutestr = str(minute)
			if minute < 10:
				minutestr = '0' + minutestr

			hourstr = str(hour)
			if hour < 10:
				hourstr = '0' + hourstr

			datestr = str(date)
			# if date < 10:
			# 	datestr = '0' + datestr

			monthstr = str(month)
			# if month < 10:
			# 	monthstr = '0' + monthstr

			data['date'] = str(year) + '-' + monthstr + '-' + datestr
			data['time'] = hourstr + minutestr
			data['physician'] = physician
			data['booked'] = 'false'

			headers['Content-Type'] = "application/json"

			if hour < 18 and hour > 8:
				print data
				response = requests.post(targeturl + targethandler, data=json.dumps(data), headers=headers)
				print response.status_code

			# Fix time
			minute = minute + 15
			if minute >= 60:
				minute = minute % 60
				hour = hour + 1
				if hour >= 24:
					hour = hour % 24
					date = date + 1
					if date > 28:
						date = date % 28
						month = month + 1
						if month > 12:
							month = month % 12
							year = year + 1



if __name__ == '__main__':
	main();
