import { Xendit } from "xendit-node";
import { XENDIT_SECRET_API_KEY } from "../config";

const xendit = new Xendit({ secretKey: XENDIT_SECRET_API_KEY });

export default xendit;
