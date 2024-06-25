import Link from "next/link";
import { withSwal } from "react-sweetalert2";

function Products({ swal }) {
  return (
    <div>
      <Link href={"/products/new"}>
        <button className="bg-primary text-white">Add a new product</button>
      </Link>
    </div>
  );
}

export default withSwal(({ swal }, ref) => <Products swal={swal} />);
