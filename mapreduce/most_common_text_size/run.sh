#!/bin/bash
cd ~/hadoop/mapreduce/most_common_text_size
gcloud beta dataproc jobs submit pyspark --cluster hadoop job.py
