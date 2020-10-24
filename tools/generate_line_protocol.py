import random
from random import randint
import time
from datetime import datetime

def generatePhoneNumber():
  res = '08'
  for i in range(8):
    res = res + str(random.randint(0, 9))
  return res

USER_COUNT = 10

types = ['normal', 'staff', 'shops']
users = [{ 'phone': generatePhoneNumber(), 'type': types[random.randint(0,2)]} for e in range(USER_COUNT)]

in_event = dict()

currentTime = int(time.time())

N = 100
with open('./tools/generated_inputs.txt', mode='w') as f:
  print('STARTED WRITING')
  for i in range(N):
    user = users[random.randint(0,USER_COUNT-1)]
    phone = user['phone']
    type = user['type']
    if phone in in_event and in_event[phone] == 1:
      action = 'checkout'
      in_event[phone] = 0
    else:
      action = 'checkin'
      in_event[phone] = 1
    # precision in seconds
    f.write('users,action='+action+',type='+type+',phone='+phone+' in_event='+str(in_event[phone])+' '+str((currentTime-N+i)*1000000000)+'\n')
  print('FINISHED WRITING')