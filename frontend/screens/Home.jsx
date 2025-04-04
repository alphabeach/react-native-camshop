import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, defaultStyle } from "../styles/styles";
import Header from "../components/Header";
import { Avatar, Button } from "react-native-paper";
import ProductCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getAllProducts } from "../redux/actions/productAction";
import { useSetCategories } from "../utils/hooks";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import SearchModal from "../components/SearchModal";
import Slider from "@react-native-community/slider";

const Home = () => {
  const [category, setCategory] = useState("");
  const [activeSearch, setActiveSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  
  // Price filter states
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [priceRange, setPriceRange] = useState([0, 10000]);
 
  const { products, loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigate = useNavigation();

  // Getting the categories
  useSetCategories(setCategories, isFocused);

  // Adding products to cart function
  const addToCardHandler = (id, name, price, image, stock) => {
    if (stock === 0)
      return Toast.show({
        type: "error",
        text1: "Out Of Stock",
      });
    dispatch({
      type: "addToCart",
      payload: {
        product: id,
        name,
        price,
        image,
        stock,
        quantity: 1,
      },
    });
    Toast.show({
      type: "success",
      text1: "Added To Cart",
    });
  };

  // Category Button Handler
  const categoryButtonHandler = (id) => {
    setCategory(id);
  };
  
  // Apply price filter
  const applyPriceFilter = () => {
    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
    setShowPriceFilter(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setCategory("");
    setMinPrice(0);
    setMaxPrice(10000);
    setPriceRange([0, 10000]);
  };

  // Fetching products based on search, category and price
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      dispatch(getAllProducts(searchQuery, category, minPrice, maxPrice));
    }, 500);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [dispatch, searchQuery, category, minPrice, maxPrice, isFocused]);

  return (
    <>
      {activeSearch && (
        <SearchModal
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setActiveSearch={setActiveSearch}
          products={products}
        />
      )}
      <View style={defaultStyle}>
        <Header />

        {/* Heading Row */}
        <View
          style={{
            paddingTop: 70,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Heading */}
          <Heading text1="Our" text2="Products" />

          {/* Search Bar */}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => setShowPriceFilter(!showPriceFilter)}>
              <Avatar.Icon
                icon={"filter"}
                size={50}
                color={"gray"}
                style={{ backgroundColor: colors.color2, elevation: 12, marginRight: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveSearch((prev) => !prev)}>
              <Avatar.Icon
                icon={"magnify"}
                size={50}
                color={"gray"}
                style={{ backgroundColor: colors.color2, elevation: 12 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Filter Panel */}
        {showPriceFilter && (
          <View style={styles.priceFilterContainer}>
            <Text style={styles.priceFilterTitle}>Filter by Price</Text>
            <Text style={styles.priceRangeText}>
              ₹{priceRange[0]} - ₹{priceRange[1]}
            </Text>
            <Slider
              value={priceRange[0]}
              minimumValue={0}
              maximumValue={10000}
              step={1000}
              minimumTrackTintColor={colors.color1}
              maximumTrackTintColor={colors.color5}
              thumbTintColor={colors.color1}
              onValueChange={(value) => setPriceRange([value, priceRange[1]])}
              style={{ marginVertical: 10 }}
            />
            <Slider
              value={priceRange[1]}
              minimumValue={0}
              maximumValue={10000}
              step={1000}
              minimumTrackTintColor={colors.color1}
              maximumTrackTintColor={colors.color5}
              thumbTintColor={colors.color1}
              onValueChange={(value) => setPriceRange([priceRange[0], value])}
              style={{ marginVertical: 10 }}
            />
            <View style={styles.filterButtonsContainer}>
              <Button 
                mode="contained" 
                onPress={applyPriceFilter}
                style={styles.filterButton}
                buttonColor={colors.color1}
              >
                Apply
              </Button>
              <Button 
                mode="outlined" 
                onPress={resetFilters}
                style={styles.filterButton}
                textColor={colors.color1}
              >
                Reset All
              </Button>
            </View>
          </View>
        )}

        {/* Active Filters Display */}
        // Change this condition:
{(category !== "" || minPrice > 0 || maxPrice < 10000) && (
  <View style={styles.activeFiltersContainer}>
    <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {category !== "" && (
        <View style={styles.filterBadge}>
          <Text style={styles.filterBadgeText}>
            {categories.find(cat => cat._id === category)?.category || "Category"}
          </Text>
          <TouchableOpacity onPress={() => setCategory("")}>
            <Text style={styles.filterBadgeClose}>×</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Only show price filter badge when values differ from default */}
      {(minPrice > 0 || maxPrice < 10000) && (
        <View style={styles.filterBadge}>
          <Text style={styles.filterBadgeText}>
            Price: ₹{minPrice} - ₹{maxPrice}
          </Text>
          <TouchableOpacity onPress={() => {
            setMinPrice(0);
            setMaxPrice(10000);
            setPriceRange([0, 10000]);
          }}>
            <Text style={styles.filterBadgeClose}>×</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  </View>
)}

        {/* Categories */}
        <View
          style={{
            flexDirection: "row",
            height: 80,
          }}
        >
          <ScrollView
            horizontal
            contentContainerStyle={{
              alignItems: "center",
            }}
            showsHorizontalScrollIndicator={false}
          >
            {/* All Products Button */}
            <Button
              style={{
                backgroundColor: category === "" ? colors.color1 : colors.color5,
                borderRadius: 100,
                margin: 5,
              }}
              onPress={() => setCategory("")}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: category === "" ? colors.color2 : "gray",
                }}
              >
                All Products
              </Text>
            </Button>

            {/* Category Buttons */}
            {categories.map((item) => (
              <Button
                key={item._id}
                style={{
                  backgroundColor:
                    category === item._id ? colors.color1 : colors.color5,
                  borderRadius: 100,
                  margin: 5,
                }}
                onPress={() => categoryButtonHandler(item._id)}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: category === item._id ? colors.color2 : "gray",
                  }}
                >
                  {item.category}
                </Text>
              </Button>
            ))}
          </ScrollView>
        </View>

        {/* Products */}
        <View style={{ flex: 1 }}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color={colors.color1} />
            </View>
          ) : products.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {products.map((item, index) => (
                <ProductCard
                  stock={item.stock}
                  name={item.name}
                  price={item.price}
                  image={item.images[0]?.url}
                  addToCardHandler={addToCardHandler}
                  id={item._id}
                  key={item._id}
                  i={index}
                  navigate={navigate}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 18, color: colors.color3 }}>
                No products found
              </Text>
            </View>
          )}
        </View>
      </View>

      <Footer activeRoute={"home"} />
    </>
  );
};

const styles = StyleSheet.create({
  priceFilterContainer: {
    backgroundColor: colors.color2,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 5,
  },
  priceFilterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceRangeText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  filterButton: {
    minWidth: 100,
  },
  activeFiltersContainer: {
    marginVertical: 5,
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filterBadge: {
    backgroundColor: colors.color1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: colors.color2,
    fontSize: 12,
  },
  filterBadgeClose: {
    color: colors.color2,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  }
});

export default Home;