# # coding: utf-8
#
# """
# FIXME
# """
#
# from __future__ import absolute_import
# from __future__ import division
# from __future__ import unicode_literals
#
# import csv
#
# from tools.db_client import DBClient
# from lxml import html
#
#
# db = DBClient('epsilond1', 'db_project_db')
#
# TABLE_NAME = 'PRE'
#
#
# def parse_urfu():
#     with open('urfu.html', 'r') as f:
#         tree = html.fromstring(''.join(f.readlines()))
#         arr = tree.xpath('/html/body/div[2]/div[2]/div[2]/div[2]/div/table[1]/tbody[1]/tr/td/text()')
#         start = 0
#         end = 8
#         while end < len(arr):
#             slice = (arr[start:end])
#             start = end
#             end += 8
#
#             if len(slice) < 8:
#                 break
#
#             db.insert_value(table_name=TABLE_NAME,
#                             university='УрФУ',
#                             faculty=slice[1],
#                             exam_results={
#                                     slice[2].lower(): int(slice[3]), slice[4].lower(): int(slice[5]), slice[6].lower(): int(slice[7])
#                                 }
#                             )
#
#
# def parse_hse():
#     with open('hse.csv', 'r') as hse:
#         reader = csv.reader(hse, delimiter=';')
#         for row in reader:
#             if '.' in row[0]:
#                 continue
#             db.insert_value(
#                 table_name=TABLE_NAME,
#                 university='ВШЭ',
#                 faculty=row[0],
#                 exam_results={
#                     row[1].lower(): int(row[2]), row[3].lower(): int(row[4]), row[5].lower(): int(row[6])
#                 }
#             )
#
#
# def parse_msu():
#     with open('msu.csv', 'r') as msu:
#         reader = csv.reader(msu, delimiter=',')
#         for row in reader:
#             db.insert_value(
#                 table_name=TABLE_NAME,
#                 university='МГУ',
#                 faculty=row[0],
#                 exam_results={
#                     row[2]: int(row[1]), row[4]: int(row[3]), row[6]: int(row[5])
#                 }
#             )
#
#
# def parse_bmstu():
#     with open('bmstu.html', 'r') as bmstu:
#         page = html.fromstring(''.join(bmstu.readlines()))
#
#         teamplate_discipline = {
#             3: 'русский язык',
#             4: 'математика',
#             5: 'физика',
#             6: 'информатика',
#             7: 'обществознание',
#             8: 'история',
#             9: 'иностранный язык'
#         }
#
#         cnt_faculty = len(page.xpath('//*[@id="mainbody"]/div[3]/div/div/div/div[4]/table/tbody/tr'))
#         for index in range(3, cnt_faculty + 1):
#             row = page.xpath('//*[@id="mainbody"]/div[3]/div/div/div/div[4]/table/tbody/tr[{}]/td/p/text()'.format(index))
#             exams = {}
#
#             for index in range(3, 10):
#                 balls = row[index]
#                 if not balls.isdigit():
#                     continue
#                 exams[teamplate_discipline[index]] = int(balls)
#
#             db.insert_value(
#                 table_name=TABLE_NAME,
#                 university='МГТУ',
#                 faculty=row[0],
#                 exam_results=exams
#             )
#
#
# parse_urfu()
#
# parse_hse()
#
# parse_msu()
#
# parse_bmstu()
#
# db.print_all(TABLE_NAME)
