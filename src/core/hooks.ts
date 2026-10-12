import { useDispatch } from "react-redux";
import type { AppDispatch } from "../types/holiday";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
