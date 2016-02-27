from kivy.app import App
from kivy.uix.widget import Widget
from kivy.properties import ObjectProperty
from kivy.clock import Clock


class Thermostat(Widget):
	button = ObjectProperty(None)

	def boot(self):
		pass

	def update(self, dt):
		pass

	def on_touch_move(self, touch):
		pass


class ThermostatApp(App):
	def build(self):
		thermostat = Thermostat()
		thermostat.boot()
		Clock.schedule_interval(thermostat.update, 1.0 / 60.0)
		return thermostat


if __name__ == '__main__':
	ThermostatApp().run()
