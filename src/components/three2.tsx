
import './three.css';
import Three from "./three";

export default function Three2() {
  return (
    <div className="container mbl-77 mx-auto pt-4 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Three img="/images/1 871.png" texta="Protein" button="İncele" />
        <Three img="/images/2 52.png" texta="Vitaminler" button="İncele" />
        <Three img="/images/3 101.png" texta="Sağlık" button="İncele" />
        <Three img="/images/5 101.png" texta="Spor<br>Gıdaları" button="İncele" />
        <Three img="/images/7 100.png" texta="Gıda" button="İncele" />
        <Three img="/images/Group 11.png" texta="Tüm<br>Ürünler" button="İncele" />
      </div>
    </div>
  );
}
