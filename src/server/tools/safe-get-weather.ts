import { z } from "zod";
import { weatherApi } from "../external-apis";

const WeatherArguments = z.object({
  location: z.string(),
});

type TWeatherArguments = z.infer<typeof WeatherArguments>;

export default {
  name: "weather",
  function: async (args: TWeatherArguments) => {
    const data = await weatherApi(args.location);
    if (data !== "Sunny") {
      return {
        success: false,
        message: "API currently not available",
      };
    }
    return data;
  },
  parameters: WeatherArguments,
};
