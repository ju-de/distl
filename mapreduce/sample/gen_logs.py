import random

DAY = 1
MONTH = 8
YEAR = 2016

for MONTH in range(1, 13):
        for DAY in range(1,31):
            if len(str(MONTH)) == 1:
                MONTH = '0'+str(MONTH)
            if len(str(DAY)) == 1:
                DAY = '0' + str(DAY)
            sites = ['https://medium.com', 'https://forbes.com', 'https://www.cnn.com', 'https://www.reddit.com', 'https://www.wikipedia.com', 'https://yahoo.com', 'https://microsoft.com', 'https://waitbutwhy.com', 'https://hackthenorth.com', 'https://www.cbc.ca']
            review = ['POS', 'NEG']
            possible_keywords = ['war', 'social movement', 'technology', 'machine learning', 'olympics', 'Obama', 'Trump', 'Clinton', 'USA', 'Apple', 'Google', 'Microsoft', 'smartwatch']
            x = ""
            for i in range(1, 32):
                    for y in range(0, random.randint(0, 20)):
                            keywords_list = []
                            for m in range(0,4):
                                    some_keyword = possible_keywords[random.randint(0,12)]
                                    if some_keyword not in keywords_list:
                                            keywords_list.append(some_keyword)
                            keywords = ",".join(keywords_list)
                            site = sites[random.randint(0, 9)]

                            x += str(DAY)+'/'+str(MONTH)+'/'+str(YEAR)+':'+str(random.randint(0, 23))+':'+str(random.randint(0, 59))+':'+str(random.randint(0, 59))+'||'+site+'||'+site+'||TEXT||'+str(review[random.randint(0,1)])+'||SUMMARIZED TEXT||'+keywords+'\n'

            a = open(str(YEAR)+'/'+str(MONTH)+'/'+str(DAY)+'-'+str(MONTH)+'-'+str(YEAR)+'.log', 'w')
            x = x[:-1]
            a.write(x)
            a.close()
