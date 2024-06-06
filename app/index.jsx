import { useCallback, useState } from "react";
import {
  Image,
  ImageBackground,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
var { width, height } = Dimensions.get("window");
import { debounce } from "lodash";
import { fetchForecastData, fetchLocationData } from "../api/weather";
import { weatherImages } from "@/constants/key";
export default function Index() {    
  
  const [toggleSearch, setToggleSearch] = useState(false);
  const [locations, setlocations] = useState([]);
  // const [location, setlocation] = useState("");
  const [weather, setweather] = useState({});

  const handleloc = (loc) => {
    setToggleSearch(false);
    setlocations([]);
    // setlocation(loc);
    fetchForecastData({ city: loc.name, days: "6" }).then((data) => {
      setweather(data);
    });
  };
  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocationData({ city: value }).then((data) => {
        setlocations(data);
      });
    }
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const { current, location } = weather;
  return (
    <View className="flex-1 flex relative">
      <Image
        blurRadius={70}
        source={require("../assets/images/bg.png")}
        className="w-full h-full absolute"
      />
      <SafeAreaView className="flex-1 mt-8 mx-4 relative z-50 ">
        <View
          className="justify-end flex-row items-center rounded-full px-3 p-3"
          style={{
            backgroundColor: toggleSearch
              ? "rgba(255,255,255,0.2)"
              : "transparent",
          }}
        >
          {toggleSearch && (
            <TextInput
              onChangeText={handleTextDebounce}
              placeholder="Search here"
              placeholderTextColor="gray"
              className="pl-4 flex-1  font-semibold text-base text-white"
            />
          )}
          <TouchableOpacity
            onPress={() => {
              setToggleSearch(!toggleSearch);
            }}
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            className="p-2 rounded-full"
          >
            <Text>Search</Text>
          </TouchableOpacity>
        </View>
        {toggleSearch && locations.length > 0 && (
          <View className="bg-slate-300 rounded-3xl   mt-3 absolute w-full top-16 z-20">
            {locations.map((item, index) => {
              let borderBottom = index + 1 != locations.length;
              let borderClass = borderBottom
                ? " border-b-2 border-b-gray-400"
                : " ";
              return (
                <TouchableOpacity key={index} onPress={() => handleloc(item)}>
                  <Text
                    className={
                      "flex-row items-center p-3  pl-8 font-semibold" +
                      borderClass
                    }
                  >
                    {item?.name}, {item?.country}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View className="flex-1 mb-2 justify-around  flex ">
          <Text className="text-center text-white text-2xl  mt-4 font-semibold">
            {location?.name},{" "}
            <Text className="text-center text-gray-300 text-lg  mt-4 font-semibold">
              {location?.country}
            </Text>
          </Text>
          <View className=" overflow-auto justify-center items-center">
            <Image
              source={weatherImages[current?.condition?.text]}
              className=" text-center "
              style={{ width: width * 0.78, height: height * 0.3 }}
              resizeMode="contain"
            />
          </View>
          <View className="space-y-2">
            <Text className="text-center text-white text-6xl p-2 mt-4 font-semibold">
              {current?.temp_c}&#176;
            </Text>
            <Text className="text-center text-white text-2xl  mt-4 tracking-widest font-semibold">
              {current?.condition?.text}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mx-4">
            <View className="flex-row items-center space-x-2">
              <Image
                source={require("../assets/images/wind.png")}
                className="h-6 w-6"
              />
              <Text className="text-white font-semibold text-lg">
                {current?.wind_kph}km
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <Image
                source={require("../assets/images/drop.png")}
                className="h-6 w-6"
              />
              <Text className="text-white font-semibold text-lg">
                {current?.humidity}%
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <Image
                source={require("../assets/images/sun.png")}
                className="h-6 w-6"
              />
              <Text className="text-white font-semibold text-lg">6:00 AM</Text>
            </View>
          </View>
          <Text className=" text-white text-xl tracking-widest font-semibold">
            Daily Forecast
          </Text>
          <ScrollView
            className=" flex-none -mx-4 mt-2"
            horizontal
            showsHorizontalScrollIndicator={false}
            overScrollMode="never"
            contentContainerStyle={{ paddingHorizontal: 15 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {weather?.forecast?.forecastday?.map((item, index) => {
              let date = new Date(item.date);
              let options = { weekday: "long" };
              let day = date?.toLocaleDateString("en-US", options);
              day = day?.split("-")[0];
              return (
                <View
                  key={index}
                  className="justify-center  h-36 flex rounded-3xl items-center space-y-1 px-6 py-8 mr-4"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <Image 
                    source={weatherImages[item?.day?.condition?.text]}
                    className="h-12 w-12"
                  />
                  <Text className="text-white font-semibold ">{day}</Text>
                  <Text className="text-white font-semibold text-2xl ">
                    {item?.day?.avgtemp_c}&#176;
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
