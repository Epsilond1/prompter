# coding: utf-8

"""
FIXME
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from tools.db_client import DBClient

db = DBClient('epsilond1', 'db_project_db')


class Prompter(object):
    TABLE_NAME = 'TESTING3'
    ALL_UNIVERSITIES = db.get_universities(TABLE_NAME)
    ALL_EXAMS = {index: value for index, value in enumerate(db.get_exams(TABLE_NAME))}

    @staticmethod
    def search_optimal(univers, user_exams):
        lengths = []
        for univer in univers:
            v_current = []
            for key in univer['exam_result'].keys():
                if user_exams[key] < univer['exam_result'][key]:
                    v_current.clear()
                    break
                v_current.append(univer['exam_result'][key] - user_exams[key])
            if v_current:
                lengths.append({
                    'univer_name': univer['univer_name'],
                    'faculty': univer['faculty'],
                    'vector': tuple(v_current),
                    'results': univer['exam_result']
                    }
                )

        return sorted(lengths, key=lambda x: x['vector'], reverse=True)


p = Prompter()

print('Выберите 3 предмета из списка (введите числа через пробел).')

for index, exam in p.ALL_EXAMS.items():
    print('{} - {}'.format(index, exam))

exams = map(int, input().split())

result_exams = {}

print('Введите баллы по выбранным предметам по одному на строке.')

for exam in exams:
    print('Предмет {}. Балл: '.format(p.ALL_EXAMS[exam]), end='')
    result_exams[p.ALL_EXAMS[exam]] = int(input())

print('Оптимальные кафедры для поступления: ')
for r in p.search_optimal(db.get_maybe_univer(p.TABLE_NAME, result_exams), result_exams):
    print('{} {}'.format(r['univer_name'], r['faculty'], end=' '))
    for k, v in r['results'].items():
        print('{}: {}'.format(k, v), end=' ')
    print()
