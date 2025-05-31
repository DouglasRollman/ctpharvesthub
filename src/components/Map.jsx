// Importing necessary libraries
import { useEffect, useState } from 'react';

import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import supabase from '../utils/supabase';

import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';

// Author: Tor Sdayur
// Recenter map once user location from browser is fetched
const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      map.setView([lat, lng], 13);
    }
  }, [lat, lng, map]);
  return null;
};

export default function Map({ location }) {
  const [currLoc, setCurrLoc] = useState({});
  
  // States for marker data
  const [foodSiteMarkers, setFoodSiteMarkers] = useState([]);
  const [shelterMarkers, setShelterMarkers] = useState([]);
  const [sexHealthClinicMarkers, setSexHealthClinicMarkers] = useState([]);
  const [cunyFoodSiteMarkers, setCunyFoodSiteMarkers] = useState([]);

  // Marker icons
  const dentalIcon = new Icon({
    iconUrl: 'https://www.svgrepo.com/show/455526/dental-plus.svg',
    iconSize: [38, 38]
  });
  const foodSiteIcon = new Icon({
    iconUrl: 'https://www.svgrepo.com/show/494450/food-market-purchasing.svg',
    iconSize: [38, 38]
  });
  const shelterMarkerIcon = new Icon({
    iconUrl: 'https://www.svgrepo.com/show/126102/shelter.svg',
    iconSize: [38, 38]
  });
  const sexHealthClinicMarkerIcon = new Icon({
    iconUrl: 'https://www.svgrepo.com/show/326199/health-worker.svg',
    iconSize: [38, 38]
  });
  const cunyFoodMarkerIcon = new Icon({
    iconUrl: 'https://www.svgrepo.com/show/533533/school-flag.svg',
    iconSize: [38, 38]
  });

  // Fetch data on mount
  useEffect(() => {
    getFoodSites();
    getShelters();
    getSexHealthClinics();
    getCunyFoodSites();
  }, []);

  useEffect(() => {
    setCurrLoc(location);
  }, [location]);

  // Fetch and set markers for food sites
  async function getFoodSites() {
    const { data, error } = await supabase.from('food').select();
    console.log("Fetching food sites...");
    if (error) {
      console.error('Error fetching food sites:', error);
      return;
    }
    console.log("Food sites fetched:", data);
    const markers = data
      .filter(site => site.LATITUDE && site.LONGITUDE && site.PHONE)
      .map(site => ({
        geocode: [site.LATITUDE, site.LONGITUDE],
        popUp: site.PROGRAM,
        contact: site.PHONE,
        address: site.ADDRESS
      }));
    console.log("Food site markers prepared:", markers);
    setFoodSiteMarkers(markers);
  }

  // Fetch and set markers for shelters
  async function getShelters() {
    const { data, error } = await supabase.from('shelters').select();
    console.log("Fetching shelters...");
    if (error) {
      console.error('Error fetching shelters:', error);
      return;
    }
    console.log("Shelters fetched:", data);
    const markers = data
      .filter(site => site.Latitude && site.Longitude)
      .map(site => ({
        geocode: [site.Latitude, site.Longitude],
        popUp: site['Center Name']
      }));
    console.log("Shelter markers prepared:", markers);
    setShelterMarkers(markers);
  }

  // Fetch and set markers for sex health clinics
  async function getSexHealthClinics() {
    const { data, error } = await supabase.from('sex_health_clinics').select();
    console.log("Fetching sex health clinics...");
    if (error) {
      console.error('Error fetching sex health clinics:', error);
      return;
    }
    console.log("Sex health clinics fetched:", data);
    const markers = data
      .filter(site => site.LATITUDE && site.LONGITUDE)
      .map(site => ({
        geocode: [site.LATITUDE, site.LONGITUDE],
        popUp: site['Clinic Name']
      }));
    console.log("Sex health clinic markers prepared:", markers);
    setSexHealthClinicMarkers(markers);
  }

  // Fetch and set markers for CUNY food sites
  async function getCunyFoodSites() {
    const { data, error } = await supabase.from('cuny_food').select();
    console.log("Fetching CUNY food sites...");
    if (error) {
      console.error('Error fetching CUNY food sites:', error);
      return;
    }
    console.log("CUNY food sites fetched:", data);
    const markers = data
      .filter(site => site.Latitude && site.Longitude && site.phone)
      .map(site => ({
        geocode: [site.Latitude, site.Longitude],
        popUp: site.School,
        contact: site.phone
      }));
    console.log("CUNY food site markers prepared:", markers);
    setCunyFoodSiteMarkers(markers);
  }

  return (
    <div className="map">
      <MapContainer center={[40.768538, -73.964741]} zoom={13}>
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup chunkedLoading>
          {foodSiteMarkers.map((marker, index) => (
            <Marker
              key={`food-${index}`}
              position={marker.geocode}
              icon={foodSiteIcon}
            >
              <Popup>
                <p>{marker.popUp}</p>
                <p>Contact: {marker.contact}</p>
                <p>Address: {marker.address}</p>
              </Popup>
            </Marker>
          ))}
          {shelterMarkers.map((marker, index) => (
            <Marker
              key={`shelter-${index}`}
              position={marker.geocode}
              icon={shelterMarkerIcon}
            >
              <Popup>
                <p>{marker.popUp}</p>
              </Popup>
            </Marker>
          ))}
          {sexHealthClinicMarkers.map((marker, index) => (
            <Marker
              key={`clinic-${index}`}
              position={marker.geocode}
              icon={sexHealthClinicMarkerIcon}
            >
              <Popup>
                <p>{marker.popUp}</p>
              </Popup>
            </Marker>
          ))}
          {cunyFoodSiteMarkers.map((marker, index) => (
            <Marker
              key={`cunyfood-${index}`}
              position={marker.geocode}
              icon={cunyFoodMarkerIcon}
            >
              <Popup>
                <p>{marker.popUp}</p>
                <p>{marker.contact}</p>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <RecenterAutomatically
          lat={currLoc.latitude}
          lng={currLoc.longitude}
        />
      </MapContainer>
    </div>
  );
}