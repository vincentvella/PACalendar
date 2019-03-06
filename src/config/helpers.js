export const categories = [
  "A Cappella/Vocal",
  "Dance",
  "Theatre",
  "Music/Instrumental",
  "Writing",
];

export const findTabIcon = (routeName, focused) => {
  let iconName = `ios-settings${focused ? '' : '-outline'}`;
  if (routeName === 'Calendar') {
    iconName = 'calendar';
  } else if (routeName === 'Discover') {
    iconName = `ios-search`;
  } else if (routeName === 'Feed') {
    iconName = `view-agenda`;
  }
  return iconName;
};
