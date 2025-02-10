#!/bin/bash
'''
cd backend/crop_recommend && flask run --host=0.0.0.0 --port=5001 &
cd ../fertilizer_recommendation && flask run --host=0.0.0.0 --port=5003 &
cd ../plant_disease_detection && flask run --host=0.0.0.0 --port=5002 &
wait
'''