import { shallow } from "enzyme";
import { CalculationSelect } from "./CalculationSelect";
import { CustomComponent } from "./CustomComponent";
import { TotalRevenue } from "./TotalRevenue";

describe("CustomComponent component", () => {
    it("should render total revenue", () => {
        const wrapper = shallow(<CustomComponent status="success" totalRevenue="$1000" />);
        expect(wrapper.find(TotalRevenue).length).toBe(1);
    });

    it("should render calculation select", () => {
        const wrapper = shallow(<CustomComponent status="success" totalRevenue="$1000" />);
        expect(wrapper.find(CalculationSelect).length).toBe(1);
    });
});

export {};
