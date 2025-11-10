from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Workout, Leaderboard
from django.utils import timezone

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Clear existing data
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Workout.objects.all().delete()
        User.objects.all().delete()
        Team.objects.all().delete()

        # Create Teams
        marvel = Team.objects.create(name='Marvel', description='Marvel Superheroes')
        dc = Team.objects.create(name='DC', description='DC Superheroes')

        # Create Users (Superheroes)
        users = [
            User.objects.create(name='Spider-Man', email='spiderman@marvel.com', team=marvel, is_superhero=True),
            User.objects.create(name='Iron Man', email='ironman@marvel.com', team=marvel, is_superhero=True),
            User.objects.create(name='Wonder Woman', email='wonderwoman@dc.com', team=dc, is_superhero=True),
            User.objects.create(name='Batman', email='batman@dc.com', team=dc, is_superhero=True),
        ]

        # Create Workouts
        workouts = [
            Workout.objects.create(name='Pushups', description='Upper body workout', difficulty='Easy'),
            Workout.objects.create(name='Running', description='Cardio workout', difficulty='Medium'),
            Workout.objects.create(name='Deadlift', description='Strength workout', difficulty='Hard'),
        ]

        # Create Activities
        Activity.objects.create(user=users[0], type='Running', duration=30, date=timezone.now().date())
        Activity.objects.create(user=users[1], type='Pushups', duration=15, date=timezone.now().date())
        Activity.objects.create(user=users[2], type='Deadlift', duration=45, date=timezone.now().date())
        Activity.objects.create(user=users[3], type='Running', duration=25, date=timezone.now().date())

        # Create Leaderboard
        Leaderboard.objects.create(user=users[0], score=120, rank=1)
        Leaderboard.objects.create(user=users[1], score=110, rank=2)
        Leaderboard.objects.create(user=users[2], score=105, rank=3)
        Leaderboard.objects.create(user=users[3], score=100, rank=4)

        self.stdout.write(self.style.SUCCESS('Test data populated successfully!'))
