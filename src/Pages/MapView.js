import React, { useState, useEffect } from "react"
import { Header } from '../Utilities/Header'
import { useAuth } from "../contexts/AuthContext"
import { MapContainer, TileLayer, Marker, Popup, WMSTileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css"
import "../css/style.css"



export const MapView = () => {

	const [postList, setPostList] = useState(null)
	const map_inital_center_coordinates = [22.31844, 87.3061777] // clock tower, iitkgp coordinates
	const [error, setError] = useState("")

	const customIcon = new Icon({
		iconUrl: require("../images/marker.png"),
		iconSize: [38, 38] // size of the icon
	});

	const { getPosts } = useAuth()

	useEffect(() => {
		getPosts().then((lst) => {
			if (lst && lst.error) throw lst;
			setPostList(lst)
		}).catch(err => {
			setError(err.message)
		})
	}, [])

	return (
		<>
			<Header />
			<MapContainer center={map_inital_center_coordinates} zoom={15}  >

				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* 
					This is the link for WMS layer we get from geoserver:-
					http://localhost:8080/geoserver/mtp/wms?service=WMS&version=1.1.0&request=GetMap&layers=mtp%3Aposts&bbox=87.30843353271484%2C22.322031021118164%2C87.3084487915039%2C22.322038650512695&width=768&height=384&srs=EPSG%3A4326&styles=heat_map_sld&format=application/openlayers#toggle 
				*/}
				<WMSTileLayer
					url="http://localhost:8080/geoserver/mtp/wms"

					params={{
						layers: "mtp:posts",
						format: 'image/png',
						request: 'GetMap',
						service: 'WMS',
						version: "1.1.0",
						styles: "heat_map_sld",
						transparent: true,
					}}
				/>

				{
					postList &&
					postList.map((post) => (
						<Marker position={[post.latitude, post.longitude]} icon={customIcon}>
							<Popup>{post.description}</Popup>
						</Marker>
					))

				}

			</MapContainer>
		</>
	)
}