#!/bin/bash
cd ~/hadoop/mapreduce/most_frequent_sites
gcloud beta dataproc jobs submit pyspark --cluster hadoop job.py
