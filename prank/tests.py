from django.test import TestCase
from django.urls import reverse


class PrankPageTests(TestCase):
    def test_homepage_loads(self):
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "SAVE YOURSELF NOW")
        self.assertContains(response, "INITIATE INCIDENT RESPONSE")

    def test_final_reveal_is_present(self):
        response = self.client.get(reverse("home"))
        self.assertContains(response, "CHALE, YOU DON FALL FOR AM!")
        self.assertContains(response, "RELAX! NOTHING HAPPEN TO YOUR DEVICE.")
        self.assertContains(response, "AKanni x")
        self.assertContains(response, "Stay alert and stay safe online.")

    def test_page_references_static_assets(self):
        response = self.client.get(reverse("home"))
        self.assertContains(response, "/static/prank/style.")
        self.assertContains(response, "/static/prank/app.")
