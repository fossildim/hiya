interface WeatherWidgetProps {
  weather: string;
}

const WeatherWidget = ({ weather }: WeatherWidgetProps) => {
  return (
    <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-card text-card-foreground shadow-sm text-sm font-medium">
      {weather}
    </div>
  );
};

export default WeatherWidget;
