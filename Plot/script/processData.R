# processData.R
library(readxl)
library(ggplot2)

# Read data from Excel file
data <- read_xlsx("Sample.xlsx")

# Create a simple scatter plot (modify as needed)
plot <- ggplot(data, aes(x = X, y = Y)) +
    geom_point() +
    labs(title = "Scatter Plot")

# Save the plot as an image
ggsave("plot.png", plot)

cat("Processing complete.")
