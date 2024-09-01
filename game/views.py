from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import game

# Create your views here.

def game_view(request):
    return(render(request, "game/game.html"))

@csrf_exempt
def save_game_result(request):
    data = json.loads(request.body)
    game_result = game(user1 = data['user1'], user2 = data['user2'], score1 = data['score1'], score2 = data['score2'])
    game_result.save()

    return JsonResponse({'status': 'success', 'game_id': game_result.id})
