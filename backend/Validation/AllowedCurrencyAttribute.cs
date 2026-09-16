using System.ComponentModel.DataAnnotations;

namespace backend.Validation;

public class AllowedCurrencyAttribute : ValidationAttribute
{
    private static readonly string[] AllowedCurrencies =
    {
        "PLN",
        "EUR",
        "USD",
        "GBP",
        "CHF",
        "UAH"
    };

    protected override ValidationResult? IsValid(
        object? value,
        ValidationContext validationContext)
    {
        if (value is not string currency)
        {
            return new ValidationResult(
                "Currency is required.");
        }

        if (!AllowedCurrencies.Contains(
                currency.ToUpperInvariant()))
        {
            return new ValidationResult(
                "Currency must be one of: PLN, EUR, USD, GBP, CHF.");
        }

        return ValidationResult.Success;
    }
}