# Reading the dataset
import pandas as pd
df = pd.read_csv("C:/Users/vishw/OneDrive/Desktop/portfolio_project/assets/llm_hallucination_dataset_v1.csv")
print(df.info())
print(df.head(10))

# Data Exploration
# Groupwise count of the 'Model_name' column
groupwise_counts = df.groupby("model_name")["domain"].count().reset_index()
groupwise_counts.columns = ["model_name", "Count"]
print(groupwise_counts)

# Groupwise count of the 'Prompt_Type' column
groupwise_counts_pt = df.groupby("prompt_type")["domain"].count().reset_index()
groupwise_counts_pt.columns = ["prompt_type", "Count"]
print(groupwise_counts_pt)


# Groupwise count of the 'hallucination_type' column
groupwise_counts_ht = df.groupby("hallucination_type")["domain"].count().reset_index()
groupwise_counts_ht.columns = ["hallucination_type", "Count"]
print(groupwise_counts_ht)


# Groupwise count of the 'severity' column
groupwise_counts_hs = df.groupby("severity")["domain"].count().reset_index()
groupwise_counts_hs.columns = ["severity", "Count"]
print(groupwise_counts_hs)

# Groupwise count of the 'domain' column
groupwise_counts_domain = df.groupby("domain")["severity"].count().reset_index()
groupwise_counts_domain.columns = ["domain", "Count"]
print(groupwise_counts_domain)
