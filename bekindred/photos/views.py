from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse

from .models import Photo
from .forms import PhotoForm


def photo_list(request):
    # Handle file upload
    if request.method == 'POST':
        form = PhotoForm(request.POST, request.FILES)
        if form.is_valid():
            newphoto = Photo(photo=request.FILES['photo'], user=request.user)
            newphoto.save()

            # Redirect to the document list after POST
            return HttpResponseRedirect(reverse('photo_list'))
    else:
        form = PhotoForm() # A empty, unbound form

    # Load documents for the list page
    documents = Photo.objects.filter(user=request.user)

    # Render list page with the documents and the form
    return render_to_response(
        'photos/list.html',
        {'documents': documents, 'form': form},
        context_instance=RequestContext(request)
    )