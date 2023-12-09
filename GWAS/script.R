# Install required packages if not installed
if (!requireNamespace("gapit", quietly = TRUE)) {
  install.packages("gapit")
}

if (!requireNamespace("data.table", quietly = TRUE)) {
  install.packages("data.table")
}

# Load required libraries
library(gapit)
library(data.table)

# Command line arguments
args <- commandArgs(trailingOnly = TRUE)

# Example usage
genotype_file_path <- args[1]
phenotype_file_path <- args[2]
selected_model <- args[3]
genotype_format <- args[4]

# Read genotype data based on the specified format
if (genotype_format == "text") {
  genotype_data <- read.table(genotype_file_path, header = TRUE, sep = "\t", stringsAsFactors = FALSE)
} else {
  # Add support for other genotype formats as needed
  stop("Unsupported genotype format")
}
# Read phenotype data (modify as needed based on your actual data format)
phenotype_data <- read.table(phenotype_file_path, header = TRUE, stringsAsFactors = FALSE)

# Convert data to a format suitable for GAPIT
geno <- as.data.table(genotype_data)
pheno <- as.data.table(phenotype_data)

# Set up GAPIT parameters
params <- gapitParam(output = "output",
                     genotypic = geno,
                     phenotypic = pheno,
                     model = selected_model)

# Run GWAS
results <- GAPIT(params)

# Output file path
output_file_path <- paste0(dirname(genotype_file_path), '/gwas_output.txt')

# Save output in the same folder
write.table(results, output_file_path, sep = "\t", quote = FALSE, row.names = FALSE)

# Print a message indicating completion
cat("GWAS process completed. Check your folder for the output.\n")
