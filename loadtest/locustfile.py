# Pinned for commit 4efa575b7ef329e16bce4a423b4b71146538f68f

from locust import HttpUser, task, between
from random import randint

class NormalUser(HttpUser):
    wait_time = between(1, 3)
    host = 'https://cucheck.in'

    def on_start(self):
        self.phone = '0'+ ''.join([str(randint(0, 9)) for _ in range(9)])

    @task
    def view_avaiable_event(self):
        self.client.get('/')

    @task
    def view_check_in_page(self):
        self.client.get('https://cucheck.in/_next/data/km03VDyJaoftmnjUe0Phy/mindmarket/visitor.json?eventId=mindmarket&role=visitor')

    @task
    def check_in_out(self):
        self.client.post('/api/check', json = {
            'eventId': 'mindmarket',
            'name': 'PP',
            'phone': self.phone,
            'role': 'visitor',
            })
        self.client.get('/_next/data/km03VDyJaoftmnjUe0Phy/mindmarket/visitor/success.json')

        self.client.post('/api/checkout', json = {
            'eventId': 'mindmarket',
            'phone': self.phone,
            'role': 'visitor',
            })
        self.client.get('/_next/data/km03VDyJaoftmnjUe0Phy/mindmarket/visitor/success.json')


