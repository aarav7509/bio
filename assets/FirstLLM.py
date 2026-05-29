# Reading the dataset
import pandas as pd
df = pd.read_csv("hf://datasets/dazzle-nu/CIS435-CreditCardFraudDetection/fraudTrain.csv")
print(df.info())
print(df.head(10))

# Data Exploration


