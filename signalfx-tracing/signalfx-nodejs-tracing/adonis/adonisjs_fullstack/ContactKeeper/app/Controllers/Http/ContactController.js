'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with contacts
 */

const Contact = use('App/Models/Contact');

class ContactController {
  /**
   * Show a list of all contacts.
   * GET contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    let contacts = await Contact.query().with('user').fetch()
    return response.json(contacts)
  }

  /**
   * Render a form to be used for creating a new contact.
   * GET contacts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new contact.
   * POST contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const name = request.input('name')
    const email = request.input('email')
    const title = request.input('title')
    const phone = request.input('phone')

    const contact = new Contact()
    contact.name = name
    contact.email = email
    contact.title = title
    contact.phone = phone

    await contact.save()
    return response.json(contact)
  }

  /**
   * Display a single contact.
   * GET contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const contact = await Contact.find(params.id)
    if (contact) {
      return response.json(contact)
    }
    return response.json({message:'Contact not found!'})
    }


  /**
   * Render a form to update an existing contact.
   * GET contacts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update contact details.
   * PUT or PATCH contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const name = request.input('name')
    const email = request.input('email')
    const title = request.input('title')
    const phone = request.input('phone')

    let contact = await Contact.find(params.id)

    contact.name = name
    contact.email = email
    contact.title = title
    contact.phone = phone

    await contact.save()
    return response.json(contact)

  }

  /**
   * Delete a contact with id.
   * DELETE contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    let contact = await Contact.find(params.id)
    let msg;
    try{
      contact.delete()
      msg = "Contact deleted!"
    } catch (e)
    {
      console.error("ERROR", e)
      msg = `Contact not found!`
    }
    return response.json({message:msg})

  }
}

module.exports = ContactController
