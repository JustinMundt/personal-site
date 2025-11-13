package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type Country struct {
	Name struct {
		Common string `json:"common"`
	} `json:"name"`

	Population int64     `json:"population"`
	Area       float64   `json:"area"`
	LatLng     []float64 `json:"latlng"`

	Region string `json:"region,omitempty"`

	Flags struct {
		Png string `json:"png"`
		Svg string `json:"svg"`
		Alt string `json:"alt"`
	} `json:"flags,omitempty"`
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/countries", func(w http.ResponseWriter, r *http.Request) {
		countries, err := fetchCountries()
		if err != nil {
			http.Error(w, "failed to fetch countries", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(countries)
	})

	log.Println("Server running on :8080")
	http.ListenAndServe(":8080", mux)
}


func fetchCountries() ([]Country, error) {
	url := "https://restcountries.com/v3.1/all?fields=name,population,area,latlng,region,flags"

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var out []Country
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, err
	}

	return out, nil
}

