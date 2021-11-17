import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {TabProgressContext} from '../TabProgress';

const Item = ({item, onPress, backgroundColor, textColor}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{item.orderId}</Text>
    </TouchableOpacity>
  );
};

const OnGoingOrder = ({}) => {
  const {
    selectedPreparingId,
    setSelectedPreparingId,
    setSelectedOrder,
    preparingOrders,
  } = useContext(TabProgressContext);

  const setPreparingOrder = item => {
    setSelectedPreparingId(item.orderId);
    setSelectedOrder(item);
  };

  const renderItem = ({item}) => {
    const backgroundColor =
      item.orderId === selectedPreparingId ? '#6e3b6e' : '#f9c2ff';
    const color = item.orderId === selectedPreparingId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setPreparingOrder(item)}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={preparingOrders}
        renderItem={renderItem}
        keyExtractor={item => item.orderId}
        extraData={selectedPreparingId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default OnGoingOrder;
