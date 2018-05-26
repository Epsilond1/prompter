# coding: utf-8

"""
FIXME
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from pymongo import MongoClient


class DBClient(object):
    HOST = '127.0.0.1'
    PORT = 27017

    @staticmethod
    def read_password():

        with open('/etc/psswd.txt', 'r') as f:
            passwd = f.readline().strip('\n')

        if not passwd:
            raise TypeError('Secret file is bad!')

        return passwd

    def __init__(self, username, db_name, host=HOST, port=PORT):
        self._client = MongoClient('mongodb://{}:{}/{}'.format(host, str(port), db_name),
                                   username=username, password=self.read_password())

        self.db = self._client[db_name]

    def print_all(self, table_name):
        """
        This function for debugging.
        """
        try:
            for packet in self.db[table_name].find():
                for k, v in packet.items():
                    if k == '_id':
                        continue
                    print('{} -> {}'.format(k, v))
        except AttributeError:
            print('Maybe table {} is not exist.'.format(table_name))

    def insert_value(self, table_name, university, faculty, exam_results):
        self.db[table_name].insert(
            {
                faculty: {
                    'univer_name': university,
                    'exam_result': exam_results,
                    'vector': list(exam_results.values())
                }
            }
        )

    def get_universities(self, table_name):
        universities = set()
        for faculty in self.db[table_name].find():
            for k, v in faculty.items():
                if k == '_id':
                    continue
                universities.add(v['univer_name'])
        return universities

    def get_exams(self, table_name):
        answer = set()

        for packet in self.db[table_name].find():
            for k, v in packet.items():
                if k == '_id':
                    continue
                for result in v['exam_result'].keys():
                    answer.add(result)

        return answer

    def get_maybe_univer(self, table_name, exams):
        univers = []

        for structure in self.db[table_name].find():
            for k, v in structure.items():
                if k == '_id':
                    continue
                if v['exam_result'].keys() == exams.keys():
                    buffer = {'faculty': k}
                    buffer.update(v)
                    univers.append(buffer)

        return univers
