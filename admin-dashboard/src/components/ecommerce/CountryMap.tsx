// react plugin for creating vector maps
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";

// Define the component props
interface Marker {
  latLng: number;
  name: string;
}

const CountryMap = ({ markers }: { markers: Marker[] }) => {

  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      markerStyle={{
        initial: {
          fill: "#465FFF",
          r: 4, // Custom radius for markers
        } as any, // Type assertion to bypass strict CSS property checks
      }}
      markersSelectable={true}
      markers={markers ? markers.map((mk: Marker) => ({
        latLng: [mk.latLng],
        name: mk.name,
        style: {
          fill: "#465FFF",
          borderWidth: 1,
          borderColor: "white",
          stroke: "#383f47",
        }
      })
      ) : []
      }
      zoomOnScroll={true}
      zoomMax={12}
      zoomMin={1}
      zoomAnimate={true}
      zoomStep={1.5}
      regionStyle={{
        initial: {
          fill: "#D0D5DD",
          fillOpacity: 1,
          fontFamily: "Outfit",
          stroke: "none",
          strokeWidth: 0,
          strokeOpacity: 0,
        },
        hover: {
          fillOpacity: 0.7,
          cursor: "pointer",
          fill: "#465fff",
          stroke: "none",
        },
        selected: {
          fill: "#465FFF",
        },
        selectedHover: {},
      }}
      regionLabelStyle={{
        initial: {
          fill: "#35373e",
          fontWeight: 500,
          fontSize: "13px",
          stroke: "none",
        },
        hover: {},
        selected: {},
        selectedHover: {},
      }}
    />
  );
};

export default CountryMap;
