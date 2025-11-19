
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

// ---------- Existing Country types/logic ----------

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

// ---------- FRED types ----------

type FredObservation struct {
	Date  string `json:"date"`
	Value string `json:"value"`
}

type FredResponse struct {
	Observations []FredObservation `json:"observations"`
}

// Read API key once at startup (set FRED_API_KEY in your env)
var fredAPIKey = os.Getenv("FRED_API_KEY")

func main() {
	if fredAPIKey == "" {
		log.Println("WARNING: FRED_API_KEY is not set, /api/fred will fail until you set it")
	}

	mux := http.NewServeMux()

	// Existing endpoint
	mux.HandleFunc("/api/countries", func(w http.ResponseWriter, r *http.Request) {
		countries, err := fetchCountries()
		if err != nil {
			log.Println("fetchCountries error:", err)
			http.Error(w, "failed to fetch countries", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(countries)
	})

	// New FRED endpoint
	// Example: /api/fred?series_id=CPIAUCSL
	mux.HandleFunc("/api/fred", func(w http.ResponseWriter, r *http.Request) {
		seriesID := r.URL.Query().Get("series_id")
		if seriesID == "" {
			http.Error(w, "missing series_id query parameter", http.StatusBadRequest)
			return
		}

		data, err := fetchFred(seriesID)
		if err != nil {
			log.Println("fetchFred error:", err)
			http.Error(w, "failed to fetch FRED data", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	})

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

// ---------- REST Countries helper ----------

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

// ---------- FRED helper ----------

func fetchFred(seriesID string) (*FredResponse, error) {
	if fredAPIKey == "" {
		return nil, fmt.Errorf("FRED_API_KEY not set")
	}

	url := fmt.Sprintf(
		"https://api.stlouisfed.org/fred/series/observations?series_id=%s&api_key=%s&file_type=json",
		seriesID, fredAPIKey,
	)


	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("http.Get: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("FRED error status=%s body=%s\n", resp.Status, string(body))
		return nil, fmt.Errorf("FRED returned status %s", resp.Status)
	}

	var data FredResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, fmt.Errorf("decode FRED JSON: %w", err)
	}

	return &data, nil
}
