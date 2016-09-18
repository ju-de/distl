#!/bin/bash
cd ~/hadoop/mapreduce/sample
gcloud beta dataproc jobs submit pyspark --cluster hadoop job.py
