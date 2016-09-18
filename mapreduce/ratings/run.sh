#!/bin/bash
cd ~/hadoop/mapreduce/ratings
gcloud beta dataproc jobs submit pyspark --cluster hadoop job.py
