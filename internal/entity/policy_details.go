package entity

import "encoding/json"

type PolicyDetails struct {
	Id       int             `json:"id" db:"id"`
	PolicyId int             `json:"policy_id" bindings:"required" db:"policy_id"`
	Details  json.RawMessage `json:"details" bindings:"required" db:"details"`
}

type CarDetails struct {
	Make          string `json:"make"`
	Model         string `json:"model"`
	Year          int    `json:"year"`
	VIN           string `json:"vin"`
	EnginePowerHP int    `json:"engine_power_hp"`
	MileageKM     int    `json:"mileage_km"`
}

type ApartmentDetails struct {
	Address      string `json:"address"`
	AreaSQM      int    `json:"area_sqm"`
	Level        int    `json:"level"`
	Rooms        int    `json:"rooms"`
	BuildingType string `json:"building_type"`
	YearBuilt    int    `json:"year_built"`
}

type HealthDetails struct {
	FullName              string   `json:"full_name"`
	BirthDate             string   `json:"birth_date"`
	BloodType             string   `json:"blood_type"`
	PreExistingConditions []string `json:"pre_existing_conditions"`
	InsuredSum            int      `json:"insured_sum"`
}

type WalletDetails struct {
	WalletType        string           `json:"wallet_type"`
	WalletBrand       string           `json:"wallet_brand"`
	CryptoAssets      []CryptoCurrency `json:"crypto_assets"`
	EstimatedValueUSD float64          `json:"total_estimated_value_usd"`
}

type CryptoCurrency struct {
	Currency string  `json:"currency"`
	Amount   float64 `json:"amount"`
}
